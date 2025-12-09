<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class([
        'dark' => ($appearance ?? 'system') === 'dark',
        'ehj' => ($appearance ?? 'system') === 'ehj',
        'ehj dark' => ($appearance ?? 'system') === 'ehj-dark',
    ])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system preference --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline background style for fallback before Tailwind loads --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }
        html.dark {
            background-color: oklch(0.145 0 0);
        }
        html.ehj {
            background-color: #f0f4ff; /* light EHJ */
        }
        html.ehj.dark {
            background-color: #0d1020; /* EHJ dark */
        }



    </style>

    <title>EHJ Model College - Computer Based Testing Platform | Ilorin</title>
    <meta name="description" content="EHJ Model College Ilorin's modern CBT platform for academic excellence. Secure online testing system for students with real-time results and comprehensive analytics." />
    <meta name="keywords" content="EHJ Model College, CBT, Computer Based Testing, Ilorin, Online Exams, Academic Excellence" />

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
</html>
