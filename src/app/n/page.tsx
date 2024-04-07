'use client'

import { Octokit } from "@octokit/rest"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Editor from "@/app/e/[id]/editor"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { repo, owner } from "@/lib/constants"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Post() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState<string>("")
  const [value, setValue] = useState<string | undefined>(undefined);
  const { toast } = useToast()

  const savePost = async () => {
    if (title.length < 1){
      toast({
        title: "Error",
        description: "Title is required"
      })
      return
    }

    if (value === undefined || value?.length < 30) {
      toast({
        title: "Error",
        description: "Post content is shorter than 30 characters"
      })
      return
    }

    const octokit = new Octokit({
      auth: session?.accessToken
    })

    try {
      await octokit.issues.create({
        owner: owner,
        repo: repo,
        title: title,
        body: value
      })

      toast({
        title: "Success",
        description: "Post created successfully"
      })
      router.push('/')

    } catch (error) {
      console.log(error)
    }

  }

  return <div className="w-full flex justify-center">
    <div className="w-full max-w-2xl px-2">

      <div className="py-6 flex justify-between gap-4">
        <div className="flex gap-2">
          <Link className="font-bold text-2xl underline" href="/">
            Posts
          </Link>
          <span className="text-muted-foreground pt-2">
            / Creating new post
          </span>
        </div>
        <Button size="icon" onClick={savePost}>
          <Save size="16" />
        </Button>
      </div>

      <Input
        className="mb-4 text-2xl font-bold"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <span className="text-sm text-muted-foreground">
        Press "/" or select text to see available editing options.
      </span>

      <Editor initialValue={undefined} onChange={setValue} />

    </div>
  </div>
}