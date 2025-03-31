export const reportError = async ({ error, stack, url }) => {
    const payload = {
        message: error.message || error.toString(),
        stack,
        url,
        userAgent: navigator.userAgent,
        time: new Date().toISOString(),
    };

    await fetch("/front-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
};
