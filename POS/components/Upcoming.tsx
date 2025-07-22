import { Clock } from "lucide-react";

const Upcoming = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background  p-8 w-full">
            <Clock size={48} className="mb-4 text-primary" />
            <h2 className="text-3xl font-bold text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground text-lg text-center max-w-md">
                Exciting features are on the way! Stay tuned for updates and new functionality in this section.
            </p>
        </div>
    );
};

export default Upcoming;