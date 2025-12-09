<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class QuestionsAndOption
 * 
 * @property int $id
 * @property string|null $question
 * @property int $question_info_id
 * @property int|null $question_instruction_id
 * @property int|null $question_no
 * @property string|null $a
 * @property string|null $b
 * @property string|null $c
 * @property string|null $d
 * @property string|null $correct_option
 * @property Carbon|null $date_added
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class QuestionsAndOption extends Model
{
	protected $table = 'questions_and_options';

	protected $casts = [
		'question_info_id' => 'int',
		'question_instruction_id' => 'int',
		'question_no' => 'int',
		'date_added' => 'datetime'
	];

	protected $fillable = [
		'question',
		'question_info_id',
		'question_instruction_id',
		'question_no',
		'a',
		'b',
		'c',
		'd',
		'correct_option',
		'date_added'
	];
}
