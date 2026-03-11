<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PracticeQuestionQuestionInfo
 * 
 * @property int $id
 * @property int $practice_question_id
 * @property int $question_info_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property PracticeQuestion $practice_question
 * @property QuestionInfo $question_info
 *
 * @package App\Models
 */
class PracticeQuestionQuestionInfo extends Model
{
	protected $table = 'practice_question_question_info';

	protected $casts = [
		'practice_question_id' => 'int',
		'question_info_id' => 'int'
	];

	protected $fillable = [
		'practice_question_id',
		'question_info_id'
	];

	public function practice_question()
	{
		return $this->belongsTo(PracticeQuestion::class);
	}

	public function question_info()
	{
		return $this->belongsTo(QuestionInfo::class);
	}
}
