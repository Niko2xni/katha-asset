import { signIn } from "@/auth";
// import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-neutral-50 px-8">
      <div className="w-full max-w-[400px] bg-white border border-neutral-200 p-12 rounded-xl shadow-sm text-center">
        <h2 className="text-[2.4rem] font-black tracking-tight text-neutral-900 mb-2">
          Welcome to LikhaMarket
        </h2>
        <p className="text-[1.4rem] text-neutral-500 mb-8">
          Sign in to access your digital assets and dashboard workspace.
        </p>

        <div className="space-y-4">
          {/* Server Action forms execute authentication securely on the server side */}
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/products" });
            }}
          >
            <button className="w-full text-[1.4rem] font-bold py-3 px-4 bg-neutral-900 text-white rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors">
              Continue with GitHub
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/products" });
            }}
          >
            <button className="w-full text-[1.4rem] font-bold py-3 px-4 bg-white border border-neutral-200 text-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
              Continue with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
