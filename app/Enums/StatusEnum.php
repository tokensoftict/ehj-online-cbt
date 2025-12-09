<?php

namespace App\Enums;

enum StatusEnum : string
{
    case Active = "Active";

    case Draft = "Draft";
    case Archived = "Archived";
}
