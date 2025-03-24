# YAML Helper

A simple focused yaml helper github action used to modify and generate yaml files.

Allows specifying new yaml file values in yaml syntax directly in your workflow.

Will deep merge new attributes with an existing yaml files using [deepmerge](https://www.npmjs.com/package/deepmerge).

## Usage

Example usage is as follows:

``` yaml
- name: Test Local Action
  uses: Liam-Johnston/yaml-helper@V1
  with:
    file-location: 'config/app.yaml'
    create-if-does-not-exist: true
    content: |
      variables:
        - key: a_variable
        - value: the_value_of_a_variable
```

This will result in a file getting created in the `./config` directory

## Action Inputs

| Name                       | Description                                                                                                                                                           | Default |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `file-location`            | `REQUIRED` Location of the yaml file. If a file does not exist in this and `create-if-does-not-exist` is set to true a new file will be created.                      |         |
| `create-if-does-not-exist` | Boolean value to allow a new file to be created if there is no existing file in the specified location.                                                               | `true` |
| `content`                  | The content that will be merged into the existing yaml config. When merging this content with existing config this content will take priority.                        | `""`    |
| `yaml-schema`              | If the resulting yaml file is to use a specific schema then it can be specified here and the schema will be included in the comment section at the start of the file. | `""`    |

## Action Outputs

| Name            | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `file-location` | Location that the final yaml file is stored.               |
| `file-created`  | Boolean value to indicate if a new file was created or not |
| `file-contents` | The final file contents in as a string                     |
