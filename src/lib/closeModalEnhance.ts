import type { SubmitFunction } from "@sveltejs/kit";

export const closeModal: (
    success: () => void,
    options?: Parameters<SubmitFunction>[0]
) => SubmitFunction = (success) => {
    return () => {
        return async ({ update }) => {
            await update();
            success();
        };
    };
};
