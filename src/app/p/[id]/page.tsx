"use client";

import { Octokit } from "@octokit/rest";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { repo, owner } from "@/lib/constants";

export default function Post({ params: { id } }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [post, setPost] =
    useState<RestEndpointMethodTypes["issues"]["get"]["response"]["data"]>();

  const fetchPost = async () => {
    const octokit = new Octokit({
      auth: session ? session?.accessToken : null,
    });

    try {
      const { data } = await octokit.issues.get({
        owner: owner,
        repo: repo,
        issue_number: parseInt(id),
      });

      setPost(data);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-2">
        <div className="flex gap-2 pt-6">
          <Link className="font-bold text-2xl underline" href="/">
            Posts
          </Link>
          <span className="text-muted-foreground pt-2">
            / {post?.title ?? "Loading..."}
          </span>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6 overflow-auto">
            {post ? (
              <div
                className="prose prose-lg dark:prose-invert prose-headings:font-title font-default"
                dangerouslySetInnerHTML={{
                  __html: remark()
                    .use(remarkGfm)
                    .use(html)
                    .processSync(post.body ?? "")
                    .toString(),
                }}
              />
            ) : (
              <span>
                Loading...
              </span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
