/*global DocsBrowserInstance*/
/*eslint no-undef: "error"*/
DocsBrowserInstance.animateScroll = false;

describe('Open all links in guides', t => {
    let navigationTree = DocsBrowserInstance.navigationTree,
        data;

    const
        ignoreClasses = ['altinst'],
        // Don't look up these in the doc tree store
        sectionsRe = /#events$|#configs$|#properties$|#functions$/;

    const store          = navigationTree.store,
        records        = [],
        contentElement = document.getElementById('content'),
        findMemberInClass = (clsRecord, propertyType, memberName, isStatic) => {
            let found = (clsRecord.data[propertyType] || []).find(mem => {
                return mem.name === memberName && (mem.scope === 'static') === isStatic;
            });

            if (!found && clsRecord.data.extends) {
                const superClass = store.getById(clsRecord.data.extends[0]);

                found = findMemberInClass(superClass, propertyType, memberName, isStatic);
            }

            return found;
        },
        assert = (records, callback) => {
            const classRecord = records.shift();

            if (!classRecord) {
                callback();
                return;
            }

            location.hash = classRecord.data.fullName;

            t.it('Checking guide: ' + classRecord.name, t => {

                t.chain(
                    { waitForSelector : `#content h1:not(:empty)` },
                    { waitForSelector : '.b-docs-loaded' },
                    { waitForSelectorNotFound : '.external-target:empty' },

                    (next) => {
                        t.notOk(contentElement.innerHTML.includes('<div class="description">undefined</div>'), 'No undefined descriptions');
                        data = store.getById(classRecord.id).data; // records data is replaced when showing inherited, need to get it again
                        next();
                    },

                    // Trying this to see if it solves test being flaky in FF
                    { waitFor : () => (data.configs && data.configs.length) ? contentElement.querySelectorAll('.configs .config').length === data.configs.length : true },

                    (next) => {
                        if (data.configs && data.configs.length) {
                            t.is(contentElement.querySelectorAll('.configs .config').length, data.configs.length, 'Configs rendered');
                        }

                        if (data.extends && data.extends.length) {
                            t.ok(contentElement.querySelector('.extends'), 'Extends rendered');
                        }

                        if (data.functions && data.functions.length) {
                            t.is(contentElement.querySelectorAll('.functions .function').length, data.functions.length, 'Functions rendered');

                            for (const f of data.functions) {
                                const fId = f.scope === 'static' ? f.name + '-static' : f.name;

                                if (f.parameters) {
                                    t.is(contentElement.querySelectorAll('#content #function-' + fId + ' .function-body .parameter').length, f.parameters.length, fId + ': function params rendered');
                                }
                            }
                        }

                        if (data.properties && data.properties.length) {
                            t.is(contentElement.querySelectorAll('.properties .property').length, data.properties.length, 'Properties rendered');
                        }

                        if (data.events) {
                            t.is(contentElement.querySelectorAll('.events .event').length, data.events.length, 'Events rendered');

                            for (const e of data.events) {
                                if (e.parameters) {
                                    t.is(contentElement.querySelectorAll('#event-' + e.name + '.event .parameter').length, e.parameters.length, e.name + ' event params rendered');
                                }
                            }
                        }

                        // verify all internal links are correct
                        Array.from(contentElement.querySelectorAll('a[href^="#"]:not(.summary-icon):not(.inherited)')).forEach((node) => {
                            const href      = node.getAttribute('href').substring(1),
                                className = href.split('#')[0],
                                member    = href.split('#')[1],
                                clsRecord = navigationTree.store.getById(className);

                            if (!clsRecord && !ignoreClasses.includes(className)) {
                                t.fail(classRecord.id + ': ' + className + ' not found');
                            }
                            else if (member) {
                                const parts        = member.split('-'),
                                    name         = parts[1],
                                    type         = parts[0],
                                    isStatic     = parts.length === 3,
                                    propertyName = type === 'property' ? 'properties' : (type + 's');

                                let found = false;

                                if (parts.length > 1) {
                                    found = findMemberInClass(clsRecord, propertyName, name, isStatic);
                                }

                                if (!found && !href.match(sectionsRe)) {
                                    t.fail(classRecord.id + ' - docs link not found: ' + href);
                                }
                            }
                        });

                        // verify all links to global symbols are OK
                        Array.from(contentElement.querySelectorAll('a.type[target=_blank]')).forEach((node) => {
                            const symbolName = node.innerHTML.trim().replace('[]', '').replace('...', '');

                            if (symbolName !== 'TouchEvent' && symbolName !== 'undefined' && symbolName !== 'null' && symbolName !== 'Class' && !window[symbolName]) {
                                t.fail(classRecord.id + ' - docs link not found: ' + symbolName);
                            }
                        });

                        assert(records, callback);
                    }
                );
            });
        };

    t.chain(
        {
            waitForEvent : [DocsBrowserInstance, 'load'],
            trigger      : () => {
                DocsBrowserInstance.onSettingsChange({
                    settings : {
                        showPublic    : true,
                        showInternal  : true,
                        showPrivate   : true,
                        showInherited : true
                    }
                });
            }
        },

        { waitForSelector : '#bryntumgantt:textEquals(Bryntum Gantt)', desc : 'Initial content shown' },

        { waitForSelectorNotFound : '.loading' },

        next => {
            navigationTree.expandAll();
            store.traverse(classRecord => {
                if (classRecord.isLeaf && classRecord.isGuide) {
                    records.push(classRecord);
                }
            });
            assert(records, next);
        }
    );

});
