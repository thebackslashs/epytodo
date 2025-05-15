import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-6xl font-bold text-primary">Oops!</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We apologize for the inconvenience. Please try again or return to the
          home page.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
