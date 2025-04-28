import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Button from '../components/ui/Button'

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
        Page not found
      </h1>
      <p className="mt-4 text-base text-gray-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8">
        <Link to="/">
          <Button variant="primary" icon={<Home size={18} />}>
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
