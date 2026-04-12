'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Fragment } from 'react/jsx-runtime';

export default function AppBreadcrumb() {
  const navigationPath = useNavigationPath();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {navigationPath.map((navigationItem, i) => (
          <Fragment key={navigationItem.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={navigationItem.href}>
                {navigationItem.path}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function useNavigationPath() {
  const pathname = usePathname();

  return pathname
    .substring(1)
    .split('/')
    .map((item, i, arr) => ({
      href: `${arr.slice(0, i).join('/')}/${item}`,
      path: item.charAt(0).toUpperCase() + item.slice(1),
    }));
}
