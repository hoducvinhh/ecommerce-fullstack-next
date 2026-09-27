import { authService } from "@/services/auth.services";
import { SignUpDto } from "@/types/api.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AuthToastMessage = {
    success?: string;
    error?: string;
};

export const useSignUp = (
    message?: AuthToastMessage & {
        verifyEmail?: string
    },
) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SignUpDto) => authService.signUp(data),

        onSuccess: (response) => {
            queryClient.setQueryData(['auth', 'session'], {
                user: response.user,
                isGuest: false,
                isAuthenticated: true,
            })

            if (response.token) {
                toast.success(message?.success ?? 'Account created successfully');

                router.push('/product/catalog');
                return;
            }

            toast.info(
                message?.verifyEmail ?? message?.success ?? "Account created! Please check your email to verify your account",
            );

            router.push('/auth/signin')
        },

        onError: (error: unknown) => {
            const responseMessage = (
                error as {
                    response?: {
                        data?: {
                            message?: string | { error?: string };
                        };
                    };
                }
            )?.response?.data?.message;

            toast.error(
                typeof responseMessage === "string"
                    ? responseMessage
                    : responseMessage?.error ?? "Sign up failed",
            );
        },
    });
};