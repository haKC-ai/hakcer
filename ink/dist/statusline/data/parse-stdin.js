export async function readStdin(timeoutMs = 50) {
    if (process.stdin.isTTY)
        return {};
    return new Promise((resolve) => {
        let data = "";
        let done = false;
        const finish = (payload) => {
            if (done)
                return;
            done = true;
            resolve(payload);
        };
        const timer = setTimeout(() => finish({}), timeoutMs);
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (chunk) => {
            data += chunk;
        });
        process.stdin.on("end", () => {
            clearTimeout(timer);
            if (!data.trim())
                return finish({});
            try {
                finish(JSON.parse(data));
            }
            catch {
                finish({});
            }
        });
        process.stdin.on("error", () => {
            clearTimeout(timer);
            finish({});
        });
    });
}
//# sourceMappingURL=parse-stdin.js.map