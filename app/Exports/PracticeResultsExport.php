<?php

namespace App\Exports;

use App\Models\PracticeResult;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PracticeResultsExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    protected $practice_id;

    public function __construct(int $practice_id)
    {
        $this->practice_id = $practice_id;
    }

    public function query()
    {
        return PracticeResult::query()
            ->with('student')
            ->where('practice_question_id', $this->practice_id);
    }

    public function headings(): array
    {
        return [
            'Student Name',
            'Registration Number',
            'Score',
            'Questions Answered',
            'Total Questions',
            'Time Taken (Mins)',
            'Date Taken',
        ];
    }

    public function map($result): array
    {
        return [
            $result->student ? $result->student->firstname . ' ' . $result->student->lastname : 'Unknown',
            $result->student ? $result->student->reg_no : 'Unknown',
            $result->score,
            $result->answered_questions,
            $result->total_questions,
            round($result->time_taken / 60, 2),
            $result->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
