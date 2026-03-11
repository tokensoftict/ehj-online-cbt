<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Practice Result</title>
    <style>
        body { font-family: sans-serif; }
        .header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 2px solid #ea580c; margin-bottom: 20px; }
        .logo { width: 80px; }
        .school-info { text-align: right; }
        .title { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; margin-top: 30px; }
        .info-table, .score-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .info-table td { padding: 8px; border: 1px solid #eee; }
        .info-table th { padding: 8px; border: 1px solid #eee; text-align: left; background-color: #f9f9f9; width: 30%; }
        .score-table th, .score-table td { padding: 10px; border: 1px solid #ddd; text-align: center; }
        .score-table th { background-color: #ea580c; color: white; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>

    <div class="header">
        <div>
            <!-- Ensure logo is loaded through an absolute path for dompdf if needed, or base64 -->
            <h2 style="color: #ea580c; margin: 0;">Eucharistic Heart of Jesus Model College</h2>
        </div>
        <div class="school-info">
            <p style="margin: 0; color: #555;">Practice Test Performance Report</p>
        </div>
    </div>

    <div class="title">
        {{ $result->practice_question->title }}
    </div>

    <div class="section-title">Student Information</div>
    <table class="info-table">
        <tr>
            <th>Name:</th>
            <td>{{ $result->student->firstname }} {{ $result->student->lastname }}</td>
        </tr>
        <tr>
            <th>Reg Number:</th>
            <td>{{ $result->student->reg_no }}</td>
        </tr>
        <tr>
            <th>Date Taken:</th>
            <td>{{ $result->created_at->format('l, F j, Y - g:i A') }}</td>
        </tr>
        <tr>
            <th>Duration Taken:</th>
            <td>{{ gmdate('H:i:s', $result->time_taken) }}</td>
        </tr>
    </table>

    <div class="section-title">Performance Summary</div>
    <table class="score-table">
        <thead>
            <tr>
                <th>Questions Attempted</th>
                <th>Total Questions</th>
                <th>Score</th>
                <th>Possible Score</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $result->answered_questions }}</td>
                <td>{{ $result->total_questions }}</td>
                <td style="font-weight: bold; font-size: 18px;">{{ $result->score }}</td>
                <td>{{ $result->total_questions * $result->practice_question->total_score_per_question }}</td>
            </tr>
        </tbody>
    </table>

    @if($result->subject_scores && is_array($result->subject_scores))
    <div class="section-title">Subject Breakdown</div>
    <table class="score-table">
        <thead>
            <tr>
                <th style="text-align: left;">Subject</th>
                <th>Correct Answers</th>
            </tr>
        </thead>
        <tbody>
            @foreach($result->subject_scores as $subject => $details)
            <tr>
                <td style="text-align: left;">{{ $subject }}</td>
                <td>{{ $details['correct'] }} / {{ $details['total'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <div class="footer">
        Generated on {{ date('l, F j, Y - g:i A') }} by CBT Online System.
    </div>

</body>
</html>
