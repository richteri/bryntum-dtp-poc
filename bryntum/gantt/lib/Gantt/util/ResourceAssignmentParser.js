import Parser from '../../Core/util/Parser.js';

const { defineParser, alt, seq, string, regexp, succeed, red, isSuccess } = Parser;

/**
 * @module Gantt/util/ResourceAssignmentParser
 */

/**
 * Consumes string while it won't hit [ or , character, value parsed will be trimmed of spaces
 *
 * Example: Maxim Bazhenov [100%] rest -> Maxim Bazhenov
 */
const resourceNamePEG = defineParser(
    red(
        regexp('[^\\[\\,]+'),
        (name) => ({
            name  : name.trim(),
            units : 100,
            match : name
        })
    )
);

/**
 * Consumes string while it provides numbers or spaces, value parsed them will be filtered of spaces
 * and just compacted number will be used.
 *
 * Example: 12 34 0 rest -> 12340
 */
const integerPEG = defineParser(
    red(
        regexp('[0-9\\s]+'),
        (value) => ({
            value : value.split(/\s*/).join(''),
            match : value
        })
    )
);

/**
 * Consumes one character either (decimal separator) '.' or ','
 *
 * Example: , rest -> ,
 */
const decimalSeparatorPEG = defineParser(
    red(
        alt(
            string('.'),
            string(',')
        ),
        (value) => ({
            value,
            match : value
        })
    )
);

/**
 * Consumes units number which might be given as:
 * - number with integer, decimal separator and fractional parts
 * - decimal separator and fractional part, so integer part will be considered 0
 * - just integer
 * value parsed will be transformed into Number type
 *
 * Example:
 * 10.2 rest -> 10.2
 * .2 rest -> 0.2
 * 100 rest -> 100
 */
const unitsNumberPEG = defineParser(
    alt(
        red(
            seq(
                () => integerPEG,
                () => decimalSeparatorPEG,
                () => integerPEG
            ),
            (integer, sep, fractional) => ({
                value : Number(`${integer.value}.${fractional.value}`),
                match : [integer.match, sep.match, fractional.match].join('')
            })
        ),
        red(
            seq(
                () => decimalSeparatorPEG,
                () => integerPEG
            ),
            (sep, fractional) => ({
                value : Number(`0.${fractional.value}`),
                match : [sep.match, fractional.match].join('')
            })
        ),
        red(
            () => integerPEG,
            (value) => ({
                value : Number(`${value.value}`),
                match : value.match
            })
        )
    )
);

/**
 * Consumes units with %, strips spaces between units number and % character.
 *
 * Example:
 * 70.5  % rest -> 70.5
 */
const unitsPersentagePEG = defineParser(
    alt(
        red(
            seq(
                () => unitsNumberPEG,
                regexp('\\s*\\%')
            ),
            (units, perc) => ({
                value : units.value,
                match : [units.match, perc].join('')
            })
        ),
        red(
            () => unitsNumberPEG,
            (units) => ({
                value : units.value,
                match : units.match
            })
        )
    )
);

/**
 * Consumes units designation string, which should look like [ units with or without % ].
 * Strips spaces before and after [, ] characters.
 *
 * Example:
 * [ 70.2 % ] rest -> 70.2
 */
const unitsDesignationPEG = defineParser(
    red(
        seq(
            regexp('\\s*\\[\\s*'),
            () => unitsPersentagePEG,
            regexp('\\s*\\]')
        ),
        (startSep, units, endSep) => ({
            units : units.value,
            match : [startSep, units.match, endSep].join('')
        })
    )
);

/**
 * Consumes just single , character stripping spaces before and after
 *
 * Example:
 *     ,     rest -> ,
 */
const commaPEG = defineParser(
    red(
        regexp('\\s*,\\s*'),
        (value) => ({
            value,
            match : value
        })
    )
);

/**
 * Consumes resource assignment string which consists of resources assignment entries separated by , character.
 * Each entry contains following parts:
 * - resource name (mandatory)
 * - units designation (optional, default is 100)
 *
 * Example:
 * Maxim Bazhenov, Mats Bryntse [90], Johan Isaksson [50 %] -> Successfull parse result
 *
 * See {@link #function-parse} for parse result analyzis
 */
const raPEG = defineParser(
    alt(
        seq(
            () => resourceNamePEG,
            () => unitsDesignationPEG,
            alt(
                seq(
                    () => commaPEG,
                    () => raPEG
                ),
                succeed('')
            )
        ),
        seq(
            () => resourceNamePEG,
            alt(
                seq(
                    () => commaPEG,
                    () => raPEG
                ),
                succeed('')
            )
        )
    )
);

/**
 * Parses resource assignment string into structured set of objects
 *
 * The string format is: `Resource Name [Units%], Other name, ...` where units part is optional as well as % sign
 *
 * @return {Object} Structured information about parsed assignments
 */
export const parse = (str) => {
    let gotSuccess = false, result = [], rest = '';

    raPEG(str, (possibleResult) => {
        if (isSuccess(possibleResult)) {
            const [, structuredResult, unstracturedRest] = possibleResult;

            if (structuredResult.length > result.length) {
                result = structuredResult;
                rest = unstracturedRest;
                gotSuccess = true;
            }
        }
    });

    let position = 0;

    return gotSuccess ? {
        rest,
        assignments : result.reduce(
            (result, part) => {
                let currentResource;

                if (typeof part == 'object') {
                    if (part.hasOwnProperty('name')) {
                        currentResource = Object.assign({ position }, part);
                        result.push(currentResource);
                    }
                    else {
                        currentResource = result[result.length - 1];
                        if (part.hasOwnProperty('units')) {
                            currentResource.units = part.units;
                        }
                        currentResource.match += part.match;
                    }

                    position += part.match.length;
                }

                return result;
            },
            []
        )
    } : false;
};

/**
 * Composes parseable string from parse result object
 *
 * @param {Object} result Parse result like object
 * @param {Boolean} [exactIfPossible=false] Set to true to compose exactly like it was given to {@link #function-parse} and if parse result reverse composition information is available.
 * @return {String}
 */
export const compose = (parseResult, exactIfPossible = false) => {
    let result = '';

    if (parseResult.assignments) {
        result += parseResult.assignments.reduce(
            (str, { name, units, match }) => {
                if (match && exactIfPossible) {
                    str += match;
                }
                else {
                    str += (str.length ? ', ' : '') + `${name} [${units}%]`;
                }

                return str;
            },
            result
        );
    }

    if (parseResult.rest) {
        result += parseResult.rest;
    }

    if (!exactIfPossible) {
        result = result.trim();
    }

    return result;
};

/**
 * Normalizes the given string by parsing it and recomposing it back thus omitting all optional parts
 *
 * @param {String} str
 * @return {String}
 */
export const normalize = (str) => compose(parse(str));

export default {
    parse,
    compose,
    normalize
};
