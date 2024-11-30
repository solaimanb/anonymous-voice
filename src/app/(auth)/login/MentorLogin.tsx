import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMentorAuth } from "@/hooks/useMentorAuth";

export const MentorLogin = () => {
  const { signInWithGoogle } = useMentorAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Login</CardTitle>
        <CardDescription>
          Sign in with your approved mentor account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={signInWithGoogle}>Continue with Google</Button>
      </CardContent>
    </Card>
  );
};