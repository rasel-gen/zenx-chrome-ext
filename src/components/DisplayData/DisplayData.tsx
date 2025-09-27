import { Link } from "@/components/Link/Link"
import { RGB } from "@/components/RGB/RGB"
import type { FC, ReactNode } from "react"

export type DisplayDataRow = { title: string } & (
  | { type: "link"; value?: string }
  | { value: ReactNode }
)

export interface DisplayDataProps {
  header?: ReactNode
  footer?: ReactNode
  rows: DisplayDataRow[]
}

// Helper function to check if a string is a valid RGB color
const isRGB = (str: string): boolean => {
  const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i
  return rgbRegex.test(str)
}

export const DisplayData: FC<DisplayDataProps> = ({ header, rows }) => (
  <div className="w-full">
    {header && (
      <div className="px-6 py-4 border-b border-stock">
        <h3 className="text-text text-lg font-medium">{header}</h3>
      </div>
    )}

    <div className="divide-y divide-stock">
      {rows.map((item, idx) => {
        let valueNode: ReactNode

        if (item.value === undefined) {
          valueNode = <span className="text-hint italic">empty</span>
        } else {
          if ("type" in item) {
            valueNode = <Link to={item.value}>Open</Link>
          } else if (typeof item.value === "string") {
            valueNode = isRGB(item.value) ? (
              <RGB color={item.value} />
            ) : (
              item.value
            )
          } else if (typeof item.value === "boolean") {
            valueNode = (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.value}
                  disabled
                  className="w-4 h-4 text-accent bg-button-bg border-button-border rounded focus:ring-accent focus:ring-2"
                />
              </div>
            )
          } else {
            valueNode = item.value
          }
        }

        return (
          <div
            key={idx}
            className="px-6 py-4 hover:bg-shading/50 transition-colors">
            <div className="flex flex-col gap-1">
              <div className="text-hint text-sm font-medium">{item.title}</div>
              <div className="text-text text-sm break-words">{valueNode}</div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)
