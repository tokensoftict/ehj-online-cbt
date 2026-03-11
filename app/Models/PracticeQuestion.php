<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PracticeQuestion
 * 
 * @property int $id
 * @property string $title
 * @property int $student_class_id
 * @property int $general_subject_id
 * @property Carbon $schedule_date
 * @property Carbon $start_time
 * @property Carbon $stop_time
 * @property int $duration
 * @property int $total_score_per_question
 * @property string|null $instruction
 * @property bool $is_approved
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property GeneralSubject $general_subject
 * @property StudentClass $student_class
 * @property Collection|QuestionInfo[] $question_infos
 *
 * @package App\Models
 */
class PracticeQuestion extends Model
{
	protected $table = 'practice_questions';

	protected $casts = [
		'student_class_id' => 'int',
		'general_subject_id' => 'int',
		'start_schedule_date' => 'datetime',
		'end_schedule_date' => 'datetime',
		'duration' => 'int',
		'total_score_per_question' => 'int',
		'is_approved' => 'bool'
	];

	protected $fillable = [
		'title',
		'student_class_id',
		'general_subject_id',
		'start_schedule_date',
		'end_schedule_date',
		'duration',
		'total_score_per_question',
		'instruction',
		'is_approved'
	];

	public function general_subject()
	{
		return $this->belongsTo(GeneralSubject::class);
	}

	public function student_class()
	{
		return $this->belongsTo(StudentClass::class);
	}

	public function question_infos()
	{
		return $this->belongsToMany(QuestionInfo::class)
					->withPivot('id')
					->withTimestamps();
	}
}
