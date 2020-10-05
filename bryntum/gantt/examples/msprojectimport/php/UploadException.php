<?php

namespace Bryntum;

class UploadException extends \Exception
{
    public function __construct($code)
    {
        parent::__construct(self::getMessageByCode($code));
    }

    /**
     * Returns exception message based on provided upload error code.
     * @param  number $code Upload error code (can be retrieved from $_FILES[filename]['error'])
     * @return string       Human readable error message.
     */
    public static function getMessageByCode($code)
    {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
                return 'The uploaded file exceeds the maximum allowed size';
            case UPLOAD_ERR_FORM_SIZE:
                return 'The uploaded file exceeds the maximum allowed size that was specified in the HTML form';
            case UPLOAD_ERR_PARTIAL:
                return 'The uploaded file was only partially uploaded';
            case UPLOAD_ERR_NO_FILE:
                return 'No file was uploaded';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Missing a temporary folder';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Failed to write file to disk';
            case UPLOAD_ERR_EXTENSION:
                return 'File upload stopped by extension';
        }

        return 'Unknown upload error';
    }
}
