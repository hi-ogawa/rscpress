import "./not-found.css";

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
		<div className="NotFound">
			<p className="code">{code}</p>
			<h1 className="title">{title}</h1>
			<div className="divider" />
			<blockquote className="quote">{quote}</blockquote>

			<div className="action">
				<a className="link" href={linkHref} aria-label={linkLabel}>
					{linkText}
				</a>
			</div>
		</div>
	);
}
