<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ClassGroup
 * 
 * @property int $id
 * @property string|null $name
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|StudentClass[] $student_classes
 *
 * @package App\Models
 */
class ClassGroup extends Model
{
	protected $table = 'class_groups';

	protected $casts = [
		'status' => 'bool'
	];

	protected $fillable = [
		'name',
		'status'
	];

	public function student_classes()
	{
		return $this->hasMany(StudentClass::class);
	}
}
