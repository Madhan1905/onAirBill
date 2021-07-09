import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/dashboard/ecommerce'

// ** Merge Routes
const Routes = [
  {
    path: '/payment',
    className: 'ecommerce-application',
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    },
    component: lazy(() => import('../../UserScreens/Payments'))
  },
  {
    path: '/stocks',
    className: 'ecommerce-application',
    component: lazy(() => import('../../UserScreens/Stocks'))
  },
  {
    path: '/profile',
    component: lazy(() => import('../../UserScreens/Profile'))
  },
  {
    path: '/home',
    component: lazy(() => import('../../UserScreens/Home'))
  },
  {
    path: '/addsalesinvoice',
    component: lazy(() => import('../../UserScreens/AddSalesInvoice'))
  },
  {
    path: '/addpurchaseinvoice',
    component: lazy(() => import('../../UserScreens/AddPurchaseInvoice'))
  },
  {
    path: '/addproduct',
    component: lazy(() => import('../../UserScreens/AddNewProduct'))
  },
  {
    path: '/apps/product/list',
    component: lazy(() => import('../../views/apps/product/list'))
  },
  {
    path: '/apps/inwardpayment/list',
    component: lazy(() => import('../../views/apps/inwardPayment/list'))
  },
  {
    path: '/apps/outwardpayment/list',
    component: lazy(() => import('../../views/apps/outwardPayment/list'))
  },
  {
    path: '/apps/transport/list',
    component: lazy(() => import('../../views/apps/transport/list'))
  },
  {
    path: '/apps/setting/list',
    component: lazy(() => import('../../views/apps/staffMember/list'))
  },
  {
    path: '/apps/customer/list',
    component: lazy(() => import('../../views/apps/customer/list'))
  },
  {
    path: '/apps/saleinvoice/list',
    component: lazy(() => import('../../views/apps/saleInvoice/list'))
  },
  {
    path: '/apps/purchaseinvoice/list',
    component: lazy(() => import('../../views/apps/purchaseInvoice/list'))
  },
  {
    path: '/apps/export/list',
    component: lazy(() => import('../../views/apps/export/list'))
  },
  {
    path: '/apps/stock/list',
    component: lazy(() => import('../../views/apps/stock/list'))
  },
  // Dashboards
  {
    path: '/dashboard/analytics',
    component: lazy(() => import('../../views/dashboard/analytics'))
  },
  {
    path: '/dashboard/ecommerce',
    component: lazy(() => import('../../views/dashboard/ecommerce')),
    exact: true
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  }
]

export { DefaultRoute, TemplateTitle, Routes }
