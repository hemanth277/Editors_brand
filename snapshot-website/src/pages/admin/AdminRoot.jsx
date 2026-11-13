import { Outlet } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'

export default function AdminRoot() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
