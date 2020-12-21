export async function createModule(): Promise<void> {
    await WebAssemblySingleton.create();
    console.log(WebAssemblySingleton);
}

type WASMModule = {
    say_hey(): number;
};

class WebAssemblyModule {
    public extern: WASMModule;
    private instance: WebAssemblyModule;

    public setExternMethods(wasmModule: WebAssembly.Instance): void {
        this.extern = <WASMModule>wasmModule.exports;
    }

    public async create(): Promise<WebAssemblyModule> {
        if (WebAssemblySingleton.instance) return WebAssemblySingleton.instance;

        try {
            const wasmModuleRaw = await fetch("./wasm_modules/main.wasm");
            const wasmArrayBuffer = await wasmModuleRaw.arrayBuffer();

            const instantiatedSource = await WebAssembly.instantiate(wasmArrayBuffer, {
                env: {
                    proc_exit(): void {
                        return;
                    }
                },
                wasi_snapshot_preview1: {
                    proc_exit(): void {
                        return;
                    }
                }
            });
            WebAssemblySingleton.setExternMethods(instantiatedSource.instance);

            return WebAssemblySingleton;
        } catch (e) {
            throw e;
        }
    }
}

export const WebAssemblySingleton: WebAssemblyModule = new WebAssemblyModule();
