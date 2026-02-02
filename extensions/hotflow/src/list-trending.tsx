import { ActionPanel, Action, Icon, List, showToast, Toast, openExtensionPreferences, Keyboard } from "@raycast/api";
import { useState } from "react";
import { Source } from "./sources/types";
import { usePromise } from "@raycast/utils";
import { fetchBySource } from "./sources/apis";

export default function Command() {
  const [source, setSource] = useState<Source>(Source.GitHub);
  const { isLoading, data, revalidate } = usePromise(fetchBySource, [source], {
    onError: (error) => {
      const toastOptions: Toast.Options = {
        style: Toast.Style.Failure,
        title: "Error",
        message: error.message,
      };

      if (source === Source.ProductHunt) {
        toastOptions.primaryAction = {
          title: "Set your API Key",
          onAction: (toast) => {
            openExtensionPreferences();
            toast.hide();
          },
        };
      }

      showToast(toastOptions);
    },
  });

  const handleRefresh = async () => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Refreshing...",
    });

    try {
      await revalidate();
      toast.style = Toast.Style.Success;
      toast.title = "Successfully refreshed";
    } catch {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to refresh";
    }
  };

  return (
    <List
      isLoading={isLoading}
      filtering={false}
      searchBarPlaceholder="Fetching hottest news..."
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select one source"
          defaultValue={Source.GitHub}
          storeValue={true}
          onChange={(newValue) => setSource(newValue as Source)}
        >
          {Object.entries(Source).map(([name, value]) => (
            <List.Dropdown.Item key={value} title={name} value={value} icon={getIcon(value)} />
          ))}
        </List.Dropdown>
      }
    >
      {data?.map((item, index) => (
        <List.Item
          key={item.id}
          title={`${index + 1}. ${item.title}`}
          subtitle={item.hotValue}
          accessories={item.info ? [{ text: item.info }] : []}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.url} />
              <ActionPanel.Section>
                <Action
                  title="Refresh"
                  icon={Icon.ArrowClockwise}
                  shortcut={Keyboard.Shortcut.Common.Refresh}
                  onAction={handleRefresh}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function getIcon(source: string) {
  switch (source) {
    case Source.BiliBili:
      return "bilibili.svg";
    case Source.GitHub:
      return { source: "github.svg", tintColor: "#000000" };
    case Source.HackerNews:
      return { source: "hacker-news.svg", tintColor: "#FF6600" };
    case Source.ProductHunt:
      return { source: "product-hunt.svg", tintColor: "#DA552F" };
    case Source.X:
      return { source: "x.svg", tintColor: "#1DA1F2" };
    default:
      return Icon.Globe;
  }
}
