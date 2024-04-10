import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout,
} from "@/routes/plugin@auth";
import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

export const Header = component$(() => {
  const session = useAuthSession();
  const signIn = useAuthSignin();
  const signOut = useAuthSignout();

  return (
    <div class="m-5 flex">
      <div class="flex-grow"></div>
      {session.value?.user?.email ? (
        <Form action={signOut}>
          <button>Sign Out</button>
        </Form>
      ) : (
        <Form action={signIn}>
          <button>Sign In</button>
        </Form>
      )}
    </div>
  );
});
