import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function OtherPage() {
  const store = useSelector((state: RootState) => ({ count: state.settings.count }))
  return (
    <div>
      <h3>Hello, Other</h3>
      <p>
        count: {store.count}
      </p>
      <p>
        <Link href='redux'>
          <a>to Redux</a>
        </Link>
      </p>
    </div>
  )
}
