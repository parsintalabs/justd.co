"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/resources/lib/utils"
import { trackEvent } from "@openpanel/nextjs"
import { CopyButton, Link, Menu } from "ui"
import { copyToClipboard } from "usemods"

export interface InstallCommandProps {
  isAdd?: boolean
  isInstall?: boolean
  isInit?: boolean
  isDiff?: boolean
  isManual?: boolean
  items?: string[]
  isInDocsComponent?: boolean
  text?: string
  className?: string
}

const defaultText =
  "Sometimes, using the CLI is the way to go, so make sure you install the necessary\n" +
  "          dependencies for the components you want to use."

const InstallCommand: React.FC<InstallCommandProps> = ({
  text = defaultText,
  items = [],
  isAdd = false,
  isInstall = false,
  isManual = false,
  isInDocsComponent = true,
  isInit = false,
  isDiff = false,
  className
}) => {
  const diffCommand = "justd-cli@latest diff"
  const addCommand = "justd-cli@latest add"
  const initCommand = "justd-cli@latest init"
  const commandArgs = items.join(" ")
  const defaultCommand = isAdd
    ? `npx ${addCommand} ${commandArgs}`
    : isDiff
      ? `npx ${diffCommand} ${commandArgs}`
      : isInit
        ? `npx ${initCommand}`
        : `npm i ${commandArgs}`

  const [command, setCommand] = useState(defaultCommand)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCopied) {
      timer = setTimeout(() => setIsCopied(false), 2000)
    }
    return () => clearTimeout(timer)
  }, [isCopied])

  const handleAction = (tool: string) => {
    let newCommand = ""
    if (isAdd) {
      const addMap = {
        NPM: "npx"
      }
      // @ts-ignore
      newCommand = `${addMap[tool]} ${addCommand} ${commandArgs}`
    } else if (isInit) {
      const initMap = {
        NPM: "npx"
      }
      // @ts-ignore
      newCommand = `${initMap[tool]} ${initCommand}`
    } else if (isInstall) {
      const installMap = {
        Bun: "bun add",
        Yarn: "yarn add",
        PNPM: "pnpm add",
        NPM: "npm i"
      }
      // @ts-ignore
      newCommand = `${installMap[tool]} ${commandArgs}`
    }
    setCommand(newCommand)
    copyToClipboard(newCommand).then(() => {
      setIsCopied(true)
      trackEvent("cli pressed", { copy: newCommand })
    })
  }

  return (
    <>
      {isAdd && isInDocsComponent && (
        <p>
          If you hit any issues, make sure you check out the installation guide{" "}
          <Link
            className="not-prose font-medium"
            intent="primary"
            href="/docs/getting-started/installation"
            target="_blank"
            rel="noreferrer"
          >
            here
          </Link>
          .
        </p>
      )}
      {isManual && text && <p>{text}</p>}
      <div
        className={cn(
          "not-prose relative flex items-center justify-between rounded-lg border bg-[#0e0e10] py-2.5 pl-4 pr-2.5 text-white font-mono text-sm [&>svg]:text-zinc-400 [&>svg]:transition [&_svg]:shrink-0",
          className
        )}
      >
        <code>{command}</code>
        <div className="pl-3 xd">
          {isInit || isDiff || isAdd ? (
            <CopyButton
              onPress={() => handleAction("NPM")}
              className="rounded-md"
              ariaLabel={command}
              isCopied={isCopied}
            />
          ) : (
            <Menu>
              <CopyButton className="rounded-sm" ariaLabel={command} isCopied={isCopied} />
              <Menu.Content showArrow placement="bottom end">
                <Menu.Item onAction={() => handleAction("Bun")}>Bun</Menu.Item>
                <Menu.Item onAction={() => handleAction("Yarn")}>Yarn</Menu.Item>
                <Menu.Item onAction={() => handleAction("PNPM")}>PNPM</Menu.Item>
                <Menu.Item onAction={() => handleAction("NPM")}>NPM</Menu.Item>
              </Menu.Content>
            </Menu>
          )}
        </div>
      </div>
    </>
  )
}

export { InstallCommand }
