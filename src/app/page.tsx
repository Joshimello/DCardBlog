'use client'
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Octokit } from "@octokit/rest"
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods"
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link"
import { LogIn } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { format } from "timeago.js"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { Skeleton } from "@/components/ui/skeleton"
import { repo, owner } from "@/lib/constants"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [issues, setIssues] = useState<RestEndpointMethodTypes["issues"]["listForRepo"]["response"]["data"]>([]);
  const [state, setState] = useState('idle')
  const { toast } = useToast()
  let firstLoad = false

  const fetchIssues = async (page: number) => {
    const octokit = new Octokit({
      auth: session ? session?.accessToken : null
    })
    setState('load')
    try {
      const { data } = await octokit.issues.listForRepo({
        owner: owner,
        repo: repo,
        per_page: 10,
        page,
        headers: {
          'If-None-Match': ''
        }
      })
      if (data.length == 0) {
        setState('end')
        return
      }
      setIssues([...issues, ...data])
      setState('idle')
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "An error occurred"
      })
    }
  }

  const deleteIssue = async (id: number) => {
    const octokit = new Octokit({
      auth: session ? session?.accessToken : null
    })
    try {
      await octokit.issues.update({
        owner: owner,
        repo: repo,
        issue_number: id,
        state: 'closed'
      })
      setIssues(issues.filter(issue => issue.number != id))
      toast({
        title: "Success",
        description: "Post deleted successfully"
      })

    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "An error occurred"
      })
    }
  }

  useEffect(() => {
    if (typeof session == 'undefined') return
    if (firstLoad) return
    firstLoad = true
    fetchIssues(1)
  }, [session])

  useBottomScrollListener(() => {
    if (state == 'load' || state == 'end') return
    fetchIssues(Math.ceil(issues.length / 10 + 1))
  }, {
    offset: 100
  })

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl px-2">
        <div className="flex justify-between items-center pt-6">
          <span className="font-bold text-2xl">
            Posts
          </span>
          {session ? (
            <div className="flex gap-4 items-center">
              <span className="text-sm flex gap-2 items-center">
                <img src={session.user?.image as string} alt={session.user?.name as string} className="w-6 h-6 rounded-full" />
                {session.user?.name}
              </span>
              <Button onClick={() => router.push('/n')}>
                New Post
              </Button>
            </div>
          ) : (
            <Button className="flex items-center gap-2" onClick={() => signIn('github', { callbackUrl: '/' })}>
              GitHub <LogIn size={16} />
            </Button>
          )}
        </div>
        {issues.map(issue => (
          <Fragment key={issue.id}>
            <Separator className="my-12" />
            <div className="w-full grid grid-cols-6 gap-y-2">
              <div className="font-bold text-sm pt-1">TITLE</div>
              <Link className="col-span-5 font-semibold truncate underline" href={"/p/" + issue.number}>
                {issue.title}
              </Link>
              <div className="font-bold text-sm pt-1">DESC.</div>
              <div className="col-span-5 line-clamp-2">
                {remark().use(remarkGfm).use(html).processSync(issue.body ?? "").toString().replace(/<[^>]+>/g, '')}
              </div>
              <div></div>
              <div className="pt-5 col-span-5 flex gap-2">
                #{issue.number} - {format(issue.created_at)} by
                <img src={issue.user!.avatar_url} alt={issue.user!.login} className="w-6 h-6 rounded-full" />
                {issue.user!.login}
              </div>

              {session?.id == issue.user?.id && (
                <div className="col-span-5 pt-4 flex gap-2 col-start-2">
                  <Button variant="destructive" onClick={() => {
                    deleteIssue(issue.number)
                  }}>
                    Delete
                  </Button>
                  <Button variant="secondary">
                    <Link href={"/e/" + issue.number}>
                      Edit
                    </Link>
                  </Button>
                </div>
              )}

            </div>
          </Fragment>
        ))}
        <Separator className="my-12" />

        {issues.length == 0 && "No posts found."}

        {state == 'loading' ? (
          <div className="w-full grid grid-cols-6 gap-y-2 pb-12">
            <div className="font-bold text-sm pt-1">TITLE</div>
            <Skeleton className="col-span-3" />
            <div className="col-span-2"></div>
            <div className="font-bold text-sm pt-1">DESC.</div>
            <Skeleton className="col-span-5" />
            <div className="col-span-1"></div>
            <Skeleton className="col-span-4 h-6" />
            <div></div>
            <div></div>
            <div className="pt-5 col-span-5 flex gap-2">
              #<Skeleton className="w-10" /> - <Skeleton className="w-32" /> by
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-32" />
            </div>
          </div>
        ) : null}
      </div>
      
    </div>
  )
}