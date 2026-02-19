import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface AuthorityBlockProps {
    updated: string;
}

/**
 * AuthorityBlock – displays editorial credibility signal.
 * Rendered statically at build time; no runtime dependencies.
 */
export function AuthorityBlock({ updated }: AuthorityBlockProps) {
    const formattedDate = updated
        ? new Date(updated).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : null;

    return (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm dark:border-emerald-900/60 dark:bg-emerald-950/30 my-6">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <div className="leading-snug text-emerald-800 dark:text-emerald-300">
                <span className="font-semibold">Reviewed by the Energy Storage Research Team.</span>
                {formattedDate && (
                    <span className="ml-1 text-emerald-700 dark:text-emerald-400">
                        Last updated{' '}
                        <time dateTime={updated}>{formattedDate}</time>.
                    </span>
                )}
            </div>
        </div>
    );
}
