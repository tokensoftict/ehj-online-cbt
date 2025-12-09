<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class GeneralSubject
 * 
 * @property int $id
 * @property string|null $name
 * @property bool $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|QuestionInfo[] $question_infos
 *
 * @package App\Models
 */
class GeneralSubject extends Model
{
	protected $table = 'general_subjects';

	protected $casts = [
		'status' => 'bool'
	];

	protected $fillable = [
		'name',
		'status'
	];

	public function question_infos()
	{
		return $this->hasMany(QuestionInfo::class);
	}
}
