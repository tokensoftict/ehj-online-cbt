<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class QuestionInfo
 *
 * @property int $id
 * @property string $name
 * @property int $student_class_id
 * @property int $general_subject_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @property GeneralSubject $general_subject
 * @property StudentClass $student_class
 * @property Collection|QuestionInstruction[] $question_instructions
 *
 * @package App\Models
 */
class QuestionInfo extends Model
{
	protected $table = 'question_infos';

	protected $casts = [
		'student_class_id' => 'int',
		'general_subject_id' => 'int'
	];

	protected $fillable = [
		'name',
		'student_class_id',
		'general_subject_id'
	];

	public function general_subject()
	{
		return $this->belongsTo(GeneralSubject::class);
	}

	public function student_class()
	{
		return $this->belongsTo(StudentClass::class);
	}

	public function question_instructions()
	{
		return $this->hasMany(QuestionInstruction::class);
	}

    public function questions_and_options()
    {
        return $this->hasMany(QuestionsAndOption::class, 'question_info_id');
    }
}
