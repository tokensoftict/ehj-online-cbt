<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Student
 * 
 * @property int $id
 * @property string $reg_no
 * @property string $surname
 * @property string $firstname
 * @property string|null $lastname
 * @property string $password
 * @property int $age
 * @property string $sex
 * @property int|null $user_id
 * @property int|null $student_class_id
 * @property string|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property StudentClass|null $student_class
 * @property User|null $user
 *
 * @package App\Models
 */
class Student extends Authenticatable
{
	use SoftDeletes;
	protected $table = 'students';

	protected $casts = [
		'age' => 'int',
		'user_id' => 'int',
		'student_class_id' => 'int'
	];

	protected $hidden = [
		'password'
	];

	protected $fillable = [
		'reg_no',
		'surname',
		'firstname',
		'lastname',
		'password',
		'age',
		'sex',
		'user_id',
		'student_class_id'
	];

	public function student_class()
	{
		return $this->belongsTo(StudentClass::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}