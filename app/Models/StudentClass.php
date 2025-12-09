<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class StudentClass
 * 
 * @property int $id
 * @property int $class_name_id
 * @property int $class_section_id
 * @property int $class_group_id
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property ClassGroup $class_group
 * @property ClassName $class_name
 * @property ClassSection $class_section
 * @property Collection|QuestionInfo[] $question_infos
 * @property Collection|QuestionInstruction[] $question_instructions
 *
 * @package App\Models
 */
class StudentClass extends Model
{
	protected $table = 'student_classes';

	protected $casts = [
		'class_name_id' => 'int',
		'class_section_id' => 'int',
		'class_group_id' => 'int',
		'status' => 'bool'
	];

	protected $fillable = [
		'class_name_id',
		'class_section_id',
		'class_group_id',
		'status'
	];

	public function class_group()
	{
		return $this->belongsTo(ClassGroup::class);
	}

	public function class_name()
	{
		return $this->belongsTo(ClassName::class);
	}

	public function class_section()
	{
		return $this->belongsTo(ClassSection::class);
	}

	public function question_infos()
	{
		return $this->hasMany(QuestionInfo::class);
	}

	public function question_instructions()
	{
		return $this->hasMany(QuestionInstruction::class);
	}
}
