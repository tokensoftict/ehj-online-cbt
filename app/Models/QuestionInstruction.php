<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class QuestionInstruction
 * 
 * @property int $id
 * @property string $instruction
 * @property int $student_class_id
 * @property int $question_info_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property QuestionInfo $question_info
 * @property StudentClass $student_class
 *
 * @package App\Models
 */
class QuestionInstruction extends Model
{
	protected $table = 'question_instructions';

	protected $casts = [
		'student_class_id' => 'int',
		'question_info_id' => 'int'
	];

	protected $fillable = [
		'instruction',
		'student_class_id',
		'question_info_id'
	];

	public function question_info()
	{
		return $this->belongsTo(QuestionInfo::class);
	}

	public function student_class()
	{
		return $this->belongsTo(StudentClass::class);
	}
}
