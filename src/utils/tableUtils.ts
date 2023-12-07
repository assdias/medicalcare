import { useAppStore } from 'src/stores/app';
import md5 from 'md5';

export function getKeyTableStorege(sufixo: string) {
  const appStore = useAppStore();
  return md5(`${appStore.user.id}-${sufixo}`);
}

export async function getStoregeVisibleColumns(
  key: string
): Promise<Array<any>> {
  const appStore = useAppStore();
  let visibleColumns: Array<any> = [];

  visibleColumns = [];
  const config = await appStore.loadConfigUserItem(key);

  if (config && config.visibleColumns.length > 0) {
    visibleColumns = config.visibleColumns;
  }

  return visibleColumns;
}

export async function setStoregeVisibleColumns(
  key: string,
  routePath: string,
  visibleColumns: Array<any>
) {
  const appStore = useAppStore();
  if (visibleColumns.length > 0) {
    await appStore.saveConfigUserItem(key, routePath, {
      visibleColumns: visibleColumns,
    });
  } else {
    appStore.removeConfigUserItem(key);
  }
}
