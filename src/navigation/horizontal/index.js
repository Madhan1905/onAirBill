import { Home, Circle, Edit, LogOut, LogIn , FileText,PieChart , Truck, ShoppingCart, Users, Settings, ExternalLink } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Home size={20} />,
    badge: 'light-warning',
    badgeText: '2',
    children: [
      {
        id: 'analyticsDash',
        title: 'Analytics',
        icon: <Circle size={12} />,
        navLink: '/dashboard/analytics'
      },
      {
        id: 'eCommerceDash',
        title: 'eCommerce',
        icon: <Circle size={12} />,
        navLink: '/dashboard/ecommerce'
      }
    ]
  },
  {
    id: 'Settings',
    title: 'Settings',
    icon: <Settings size={20} />,
    navLink: '/apps/setting/list'
  },
  {
    id: 'Customers',
    title: 'Customers',
    icon: <Users size={20} />,
    navLink: '/apps/customer/list'
  },
  {
    id: 'Transport',
    title: 'Transport',
    icon: <Truck size={20} />,
    navLink: '/apps/transport/list'
  },
  {
    id: 'Products',
    title: 'Products',
    icon: <ShoppingCart size={20} />,
    children: [
      {
        id: 'Products',
        title: 'Products',
        icon: <ShoppingCart size={20} />,
        navLink: '/apps/product/list'
      },
      {
        id: 'Stock',
        title: 'Stock',
        icon: <PieChart size={20} />,
        navLink: '/apps/stock/list'
      },
    ]
  },
  {
    id: 'Sale Invoice',
    title: 'Sale Invoice',
    icon: <FileText size={20} />,
    navLink: '/apps/saleinvoice/list'
  },
  {
    id: 'Purchase Invoice',
    title: 'Purchase Invoice',
    icon: <FileText size={20} />,
    navLink: '/apps/purchaseinvoice/list'
  },
  {
    id: 'Export',
    title: 'Export',
    icon: <ExternalLink size={20} />,
    navLink: '/apps/export/list'
  },
  {
    id: 'Payment Receipt',
    title: 'Payment Receipt',
    icon: <Edit size={20} />,
    children: [
      {
        id: 'Inward Payment',
        title: 'Inward Payment',
        icon: <LogIn size={20} />,
        navLink: '/apps/inwardpayment/list'
      },
      {
        id: 'Outward Payment',
        title: 'Outward Payment',
        icon: <LogOut size={20} />,
        navLink: '/apps/outwardpayment/list'
      },
    ],
  },
]
