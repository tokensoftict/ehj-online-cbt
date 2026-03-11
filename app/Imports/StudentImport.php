<?php

namespace App\Imports;

use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeImport;
use Maatwebsite\Excel\Events\BeforeSheet;

class StudentImport implements ToModel, WithHeadingRow, WithEvents
{

    use Importable, RegistersEventListeners;

    var $fileuploads;
    var $order_info;
    public function __construct($fileuploads, $order_info)
    {
        $this->order_info = $order_info;
        $this->fileuploads = $fileuploads;
    }

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (!empty($row['reg_no']) && !empty($row['surname']) && !empty($row['firstname']) && !empty($row['lastname']) && !empty($row['age']) && !empty($row['sex'])) {
            $check = Student::where('reg_no', $row['reg_no'])->count();
            if ($check == 0) {
                $student = new Student();
                $student->reg_no = $row['reg_no'];
                $student->surname = $row['surname'];
                $student->firstname = $row['firstname'];
                $student->lastname = $row['lastname'];
                $student->password = bcrypt(strtolower($row['surname']));
                $student->age = $row['age'];
                $student->sex = $row['sex'];
                $student->student_class_id = $this->order_info->class_id;
                $student->user_id = $this->fileuploads->uploaded_by;
                $student->save();
            }
        }
    }


    public static function afterImport(AfterImport $event)
    {
        $imports = $event->getConcernable();
        $imports->fileuploads->status_id = 5;
        $imports->fileuploads->update();
    }

}