'use client'

import { Octokit } from "@octokit/rest"
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { remark } from "remark"
import html from "remark-html"
import remarkGfm from "remark-gfm"
import Editor from "./editor"
import { generateJSON } from "@tiptap/html"
import { defaultExtensions } from "./extensions"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { repo, owner } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function Post({ params: { id } }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [initJSON, setInitJSON] = useState<Record<string, any> | null>(null);
  const [title, setTitle] = useState<string>("")
  const [value, setValue] = useState<string | undefined>(undefined);
  const { toast } = useToast()

  const fetchPost = async () => {
    const octokit = new Octokit({
      auth: session ? session?.accessToken : null
    })

    try {
      const { data } = await octokit.issues.get({
        owner: owner,
        repo: repo,
        issue_number: parseInt(id),
      })

      const htmlbody = remark().use(remarkGfm).use(html).processSync(data.body ?? "").toString()
      const jsonbody = generateJSON(htmlbody, defaultExtensions)
      setInitJSON(jsonbody)
      setTitle(data.title)
      toast({
        title: "Success",
        description: "Post fetched successfully"
      })

    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Could not fetch post"
      })
    }
  }

  const updatePost = async () => {
    const octokit = new Octokit({
      auth: session?.accessToken
    })

    try {
      await octokit.issues.update({
        owner: owner,
        repo: repo,
        title: title,
        body: value,
        issue_number: parseInt(id),
      })

      toast({
        title: "Success",
        description: "Post updated successfully"
      })
      router.push('/')

    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Could not update post"
      })
    }

  }

  useEffect(() => {
    fetchPost()
  }, [])

  return <div className="w-full flex justify-center">
    <div className="w-full max-w-2xl px-2">

      <div className="py-6 flex justify-between gap-4">
        <div className="flex gap-2">
          <Link className="font-bold text-2xl underline" href="/">
            Posts
          </Link>
          <span className="text-muted-foreground pt-2">
            / {title ?? 'Loading...'}
          </span>
        </div>
        <Button size="icon" onClick={updatePost}>
          <Save size="16" />
        </Button>
      </div>

      <span className="text-sm text-muted-foreground">
        Editing post "{title}"
      </span>

      <Input
        className="mb-4 text-2xl font-bold"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <span className="text-sm text-muted-foreground">
        Press "/" or select text to see available editing options.
      </span>

      {initJSON && <Editor initialValue={initJSON} onChange={setValue} />}

    </div>
  </div>
}