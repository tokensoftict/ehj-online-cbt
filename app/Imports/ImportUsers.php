<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Events\AfterImport;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeImport;
use Maatwebsite\Excel\Events\BeforeSheet;

class ImportUsers implements ToModel, WithHeadingRow, WithEvents
{
    use Importable, RegistersEventListeners;

    var $fileuploads;
    var $order_info;
    public function __construct($fileuploads, $order_info){
        $this->order_info = $order_info;
        $this->fileuploads = $fileuploads;
    }

    /**
     * @param array $row
     * @return Model|Model[]|null
     */
    public function model(array $row)
    {
        if(!empty($row['name']) && !empty($row['email']) && !empty($row['username']) && !empty($row['password']))
        {

            if(User::where('username',$row['username'])->get()->count() > 0)  return null;

            if(User::where('email',$row['email'])->get()->count() > 0)  return null;

            $user = new User;

            $user->name = $row['name'];

            $user->email = $row['email'];

            $user->username = $row['username'];

            $user->password = bcrypt($row['password']);

            $user->group_id = $this->order_info->user_group_id;

            $user->save();

            return null;
        }
        return null;
    }


    public static function afterSheet(AfterSheet $event)
    {
        //app('log')->info('AfterSheet  Called');
    }

    public static function beforeImport(BeforeImport $event)
    {
        //app('log')->info('BeforeImport Called');
    }

    public static function afterImport(AfterImport $event)
    {
        $imports = $event->getConcernable();
        $imports->fileuploads->status_id = 5;
        $imports->fileuploads->update();
    }

    public static function beforeSheet(BeforeSheet $event)
    {
        //app('log')->info('BeforeSheet  Called');
    }
}
