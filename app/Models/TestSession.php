<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TestSession
 * 
 * @property int $id
 * @property int $student_id
 * @property int $practice_question_id
 * @property array|null $answers
 * @property string|null $current_subject
 * @property int|null $time_remaining
 * @property bool $is_completed
 * @property Carbon|null $completed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property PracticeQuestion $practice_question
 * @property Student $student
 *
 * @package App\Models
 */
class TestSession extends Model
{
	protected $table = 'test_sessions';

	protected $casts = [
		'student_id' => 'int',
		'practice_question_id' => 'int',
		'answers' => 'json',
		'time_remaining' => 'int',
		'is_completed' => 'bool',
		'completed_at' => 'datetime'
	];

	protected $fillable = [
		'student_id',
		'practice_question_id',
		'answers',
		'current_subject',
		'time_remaining',
		'is_completed',
		'completed_at'
	];

	public function practice_question()
	{
		return $this->belongsTo(PracticeQuestion::class);
	}

	public function student()
	{
		return $this->belongsTo(Student::class);
	}
}
