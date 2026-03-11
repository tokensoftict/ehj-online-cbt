<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PracticeResult
 * 
 * @property int $id
 * @property int $student_id
 * @property int $practice_question_id
 * @property int $total_questions
 * @property int $answered_questions
 * @property int $correct_answers
 * @property float $score
 * @property int $time_taken
 * @property array|null $answers_data
 * @property array|null $subject_scores
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property PracticeQuestion $practice_question
 * @property Student $student
 *
 * @package App\Models
 */
class PracticeResult extends Model
{
	protected $table = 'practice_results';

	protected $casts = [
		'student_id' => 'int',
		'practice_question_id' => 'int',
		'total_questions' => 'int',
		'answered_questions' => 'int',
		'correct_answers' => 'int',
		'score' => 'float',
		'time_taken' => 'int',
		'answers_data' => 'json',
		'subject_scores' => 'json'
	];

	protected $fillable = [
		'student_id',
		'practice_question_id',
		'total_questions',
		'answered_questions',
		'correct_answers',
		'score',
		'time_taken',
		'answers_data',
		'subject_scores'
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
