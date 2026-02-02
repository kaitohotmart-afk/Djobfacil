import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export default function Loading() {
    return (
        <div className="container py-8 space-y-8">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-slate-800" />
                    <Skeleton className="h-4 w-64 bg-slate-800" />
                </div>
                <Skeleton className="h-10 w-32 bg-slate-800" />
            </div>

            {/* Filter Skeleton */}
            <Skeleton className="h-20 w-full rounded-xl bg-slate-800" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="border-white/5 bg-slate-900/50">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-20 bg-slate-800" />
                                    <Skeleton className="h-6 w-40 bg-slate-800" />
                                </div>
                                <Skeleton className="h-6 w-16 bg-slate-800" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3 space-y-2">
                            <Skeleton className="h-4 w-full bg-slate-800" />
                            <Skeleton className="h-4 w-3/4 bg-slate-800" />
                        </CardContent>
                        <CardFooter className="pt-3 border-t border-white/5 justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-6 rounded-full bg-slate-800" />
                                <Skeleton className="h-4 w-24 bg-slate-800" />
                            </div>
                            <Skeleton className="h-8 w-24 bg-slate-800" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
