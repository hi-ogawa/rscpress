export interface NotFoundProps {
	code?: string;
	title?: string;
	quote?: string;
	linkText?: string;
	linkHref?: string;
	linkLabel?: string;
}

export function NotFound({
	code = "404",
	title = "PAGE NOT FOUND",
	quote = "But if you don't change your direction, and if you keep looking, you may end up where you are heading.",
	linkText = "Take me home",
	linkHref = "/",
	linkLabel = "go to home",
}: NotFoundProps) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full text-center">
				<div className="mb-8">
					<h1 className="text-9xl font-bold text-gray-300 mb-4">{code}</h1>
					<h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
					<div className="w-12 h-px bg-gray-300 mx-auto mb-8"></div>
					<blockquote className="text-gray-600 italic text-lg leading-relaxed mb-8">
						{quote}
					</blockquote>
				</div>

				<div>
					<a
						href={linkHref}
						aria-label={linkLabel}
						className="btn btn-primary text-lg px-8 py-3"
					>
						{linkText}
					</a>
				</div>
			</div>
		</div>
	);
}
