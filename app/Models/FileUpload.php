<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class FileUpload
 * 
 * @property int $id
 * @property string $filename
 * @property string $filepath
 * @property string $type
 * @property string $info
 * @property int $uploaded_by
 * @property int $status_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Status $status
 * @property User $user
 *
 * @package App\Models
 */
class FileUpload extends Model
{
	protected $table = 'file_uploads';

	protected $casts = [
		'uploaded_by' => 'int',
		'status_id' => 'int'
	];

	protected $fillable = [
		'filename',
		'filepath',
		'type',
		'info',
		'uploaded_by',
		'status_id'
	];

	public function status()
	{
		return $this->belongsTo(Status::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'uploaded_by');
	}
}
