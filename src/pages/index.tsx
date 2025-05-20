import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/components/auth/auth-provider';

export default function EntryPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [loadingStep, setLoadingStep] = useState('Initializing application');

    useEffect(() => {
        const loadingSteps = [
            { progress: 20, message: 'Getting things ready' },
            { progress: 50, message: 'Just making sure everything checks out' },
            { progress: 70, message: 'Almost there...' },
            { progress: 100, message: 'You are in, lets begin' }
        ];

        const timer = setInterval(() => {
            const currentStep = loadingSteps.find(step =>
                step.progress > progress && step.progress <= 100
            );

            if (currentStep) {
                setProgress(currentStep.progress);
                setLoadingStep(currentStep.message);
            }

            if (progress === 100) {
                clearInterval(timer);
                    router.push('/dashboard');
            }
        }, 500);

        return () => clearInterval(timer);
    }, [isAuthenticated, isLoading, progress, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center w-full max-w-md px-4">
                <Image
                    src="/logo.png"
                    alt="Ganz Africa Logo"
                    width={200}
                    height={200}
                    className="mx-auto mb-6"
                    priority
                />
                <h1 className="text-2xl font-bold text-green-700">
                    Empowering Youth Changemakers
                </h1>
                <p className="text-orange-500 mt-2">
                    Transforming Land, Environment, and Agriculture
                </p>

                <div className="mt-6 w-full">
                    <Progress value={progress} className="w-full" />
                </div>

                <div className="mt-4 text-black dark:text-white">
                    {loadingStep}...
                </div>
            </div>
        </div>
    );
}