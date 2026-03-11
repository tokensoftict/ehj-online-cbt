import 'katex/dist/katex.min.css'
import katex from 'katex'


export function MathKatex({ value }: { value: string }) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: katex.renderToString("<p>Hello world</p>", {
                    throwOnError: false,
                }),
            }}
        />
    )
}
