import * as path from 'path';
import { GoogleApiClient } from './GoogleApiClient';

describe('GoogleApiClient', () => {
  let googleApiClient: GoogleApiClient;

  beforeEach(() => {
    const googleServiceAccountJsonPath = path.join(__dirname, '../../google-service-account.json');

    googleApiClient = new GoogleApiClient(googleServiceAccountJsonPath);
  });

  describe('create and update form', () => {
    it('should return a google maps client', async () => {
      const createResult = await googleApiClient.createForm(
        'Test form',
      );

      console.log(createResult)
      expect(createResult).toBeDefined();

      const updateResult = await googleApiClient.updateFormInfo(
        createResult.formId,
        {
          title: 'Test form updated',
          description: 'Test form updated',
          documentTitle: 'Test form updated document title',
        },
      );

      console.log(updateResult)
      expect(updateResult).toBeDefined();

      const createItemsResult = await googleApiClient.createItemsToForm(
        createResult.formId,
        [
          {
            title: 'Test item',
            description: 'Test item description',
            questionItem:{
              question: {
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    {
                      value: 'test option 1'
                    },
                    {
                      value: 'test option 2'
                    }
                  ]
                }
              }
            }
          },
          {
            title: 'Test item 2',
            description: 'Test item description 2',
            textItem: {},
          },
        ],
      );

      console.log(createItemsResult)
      expect(createItemsResult).toBeDefined();
    }, 100000);
  });
});
