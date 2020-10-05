<?php

namespace Bryntum\Util;

class ScriptEditor
{
    private static function getRegExp($region, $startTag = null, $endTag = null)
    {
        if (!$startTag) $startTag = "\s*--\s*region=$region";
        if (!$endTag) $endTag = "\s*--\s*endregion=$region";

        return "#$startTag(.*?)$endTag#s";
    }

    private static function matchTextRegion($text, $region, &$matches = null, $startTag = null, $endTag = null)
    {
        if (!$matches) $matches = [];

        $regexp = self::getRegExp($region, $startTag, $endTag);

        return preg_match($regexp, $text, $matches);
    }

    /**
     * Returns a region of the provided file.
     * @param  String $file       File get a region from.
     * @param  String $region     Region name (by default the region will be searched as text between "-- region=$region" and  "-- endregion=$region" strings).
     * @param  Array  [&$matches] If provided will be fullfilled with internal preg_match call results.
     * @param  String [$startTag] If provided, a string to be used to match the region start ("-- region=$region" by default).
     * @param  String [$endTag]   If provided, a string to be used to match the region start ("-- endregion=$region" by default).
     * @return String             Region text.
     */
    public static function getFileRegion($file, $region, &$matches = null, $startTag = null, $endTag = null)
    {
        if (!$matches) $matches = [];

        if (self::getTextRegion(file_get_contents($file), $region, $matches, $startTag, $endTag))
        {
            return $matches[1];
        }
    }

    /**
     * Returns a region of the provided text.
     * @param  String $text       Text to get a region from.
     * @param  String $region     Region name (by default the region will be searched as text between "-- region=$region" and  "-- endregion=$region" strings).
     * @param  Array  [&$matches] If provided will be fullfilled with internal preg_match call results
     * @param  String [$startTag] If provided, a string to be used to match the region start ("-- region=$region" by default).
     * @param  String [$endTag]   If provided, a string to be used to match the region start ("-- endregion=$region" by default).
     * @return String             Region text.
     */
    public static function getTextRegion($text, $region, &$matches = null, $startTag = null, $endTag = null)
    {
        if (!$matches) $matches = [];

        if (self::matchTextRegion($text, $region, $matches))
        {
            return $matches[1];
        }
    }

    /**
     * Replaces a region in the provided text.
     * @param  String $text             Text to search and replace a region.
     * @param  String $region           Region name (by default the region will be searched as text between "-- region=$region" and  "-- endregion=$region" strings).
     * @param  String [$replacement=''] String to replace.
     * @param  String [$startTag]       If provided, a string to be used to match the region start ("-- region=$region" by default).
     * @param  String [$endTag]         If provided, a string to be used to match the region start ("-- endregion=$region" by default).
     * @return String                   New text.
     */
    public static function replaceTextRegion($text, $region, $replacement = '', $startTag = null, $endTag = null)
    {
        $regexp = self::getRegExp($region, $startTag, $endTag);

        return preg_replace($regexp, $replacement, $text);
    }
}
