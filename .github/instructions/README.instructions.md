Example fix (double-check the actual variable names and logic in your workflow):

YAML
- name: Send file changes to Lovable
  run: |
    if [ -z "${{ secrets.LOVABLE_API_URL }}" ]; then
      echo "LOVABLE_API_URL is not set"; exit 1
    fi
    curl -X POST "${{ secrets.LOVABLE_API_URL }}/api/sync" -d @file_changes.json
Ensure LOVABLE_API_URL (or any other URL variable) is defined in your repository secrets/settings.
